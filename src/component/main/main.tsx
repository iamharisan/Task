import { useEffect, useState } from "react";
import { Drawer, Button, Input } from "antd";
import "./main.css";
import { Select } from "antd";
import { LeftOutlined } from '@ant-design/icons';
import { showErrorMessage, showSuccessMessage } from "../../shared/message";
import Spinner from "../../shared/spinner";
function Main() {
  const defaultValue = { value: "", label: "" };
  const url = "https://webhook.site/37773d6f-f6eb-4afe-862f-7a37935f1498";
  const [segmentName, setSegmentName] = useState<string>("");
  const [modal, setModal] = useState<boolean>(false);
  const [schema, setSchema] = useState([{ ...defaultValue }]);
  const [loading, setLoading] = useState<boolean>(false);
  const options = [
    { value: "first_name", label: "First Name" },
    { value: "last_name", label: "Last Name" },
    { value: "gender", label: "Gender" },
    { value: "age", label: "Age" },
    { value: "account_name", label: "Account Name" },
    { value: "city", label: "City" },
    { value: "state", label: "State" },
  ];

  useEffect(() => {
    if (!modal) {
      setSegmentName("");
      setSchema([defaultValue]);
    }
  }, [modal]);

  function onSelectSchema(value: string, schema: any, i: number) {
    const tempData = [...schema];
    const selectedObj = options.find((obj) => obj.value === value);
    tempData[i] = selectedObj;
    setSchema(tempData);
  }

  function removeSegment(i: number) {
    const tempData = [...schema];
    if (tempData.length > 1) {
      tempData.splice(i, 1);
      setSchema(tempData);
    } else if (tempData.length === 1) {
      setSchema([defaultValue]);
    }
  }

  function isAnyEmptySchema() {
    const tempSchema = [...schema];
    return tempSchema.some((obj) => obj.value === "");
  }

  function addSchema() {
    const tempData = [...schema];
    if (tempData[tempData.length - 1].value) {
      tempData.push({ ...defaultValue });
      setSchema(tempData);
    } else showErrorMessage("Please add the segment");
  }

  function onSave() {
    const tempSchema = [...schema];
    const tempArray: any = [];
    if (!segmentName || !segmentName.trim().length) {
      showErrorMessage("Please enter a segment name");
    } else if (!schema.length || isAnyEmptySchema()) {
      showErrorMessage("Please select the schema");
    } else {
      setLoading(true);
      tempSchema.forEach((obj) => tempArray.push({ [obj.value]: obj.label }));
      const data = {
        segment_name: segmentName,
        schema: [...tempArray],
      };
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          setLoading(false);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.text();
        })
        .then((result) => {
          showSuccessMessage("Segment Added Successfully");
          setModal(false);
        })
        .catch((error) => {
          showErrorMessage('Failed to fetch')
          setLoading(false);
          console.error(error);
        });
    }
  }

  return (
    <div>
      <div className="nav"></div>
      <div className="hero">
        <button className="btn" onClick={() => setModal(true)}>
          Save Segment
        </button>
      </div>
      <Drawer
        title="Saving Segment"
        placement="right"
        onClose={() => setModal(false)}
        visible={modal}
        width={450}
        footer={
          <div className="footer">
            <Button
              className="primary"
              type="primary"
              style={{ marginLeft: 8 }}
              onClick={() => onSave()}
            >
              {loading ? <Spinner size="small" /> : "Save the segment"}
            </Button>
            <Button className="_primary" onClick={() => setModal(false)}>
              Cancel
            </Button>
          </div>
        }
        closeIcon={<LeftOutlined style={{ fontSize: '20px', color: 'white' }} />}
      >
        <div className="fields">
          <label htmlFor="segment">Enter the name of the Segment</label>
          <Input
            id="segment"
            onChange={(e) => setSegmentName(e.target.value)}
            placeholder="Name of the Segment"
            value={segmentName}
          />
        </div>
        <p className="desc">
          To save your segment,you need to add the schemas to build the query
        </p>
        <div className="filters">
          <div className="tasks">
            <div className="color green"></div>
            <p> - User Tasks</p>
          </div>
          <div className="tasks">
            <div className="color red"></div>
            <p> - Group Tasks</p>
          </div>
        </div>
        {schema.length &&
          schema.map((obj, i) => (
            <div className="dropdownFields" key={i}>
              <div className="rounded"></div>
              <div className="dropDownInputs">
                <Select
                  onChange={(e) => onSelectSchema(e, schema, i)}
                  value={obj.value || "Add schema to segment"}
                  options={options}
                />
              </div>
              {schema[0].value && (
                <div className="remove" onClick={() => removeSegment(i)}>
                  -
                </div>
              )}
            </div>
          ))}
        <div className="newSchema">
          <div className="schemaName" onClick={addSchema}>
            +Add new schema
          </div>
        </div>
      </Drawer>
    </div>
  );
}

export default Main;
