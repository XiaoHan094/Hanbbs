import { ElMessageBox } from 'element-plus'

const Confirm = (message,okfun) => {
    ElMessageBox.confirm(
      message,
      'Warning',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'info',
      }
    )
      .then(() => {
        okfun();
 
      })
      .catch(() => {
      })
  }
  export default Confirm;