import { message } from "antd";

export const showSuccessMessage = (content:string, duration = 3) => {
  message.success({
    content,
    duration,
  });
};

export const showErrorMessage = (content:string, duration = 3) => {
  message.error({
    content,
    duration,
  });
};
