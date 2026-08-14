export const validateNationalCode = (code: string): boolean => {
    if (!code || code.length !== 10 || !/^\d{10}$/.test(code)) {
      return false;
    }
    
    const check = parseInt(code[9]);
    let sum = 0;
    
    for (let i = 0; i < 9; i++) {
      sum += parseInt(code[i]) * (10 - i);
    }
    
    const remainder = sum % 11;
    const isValid = (remainder < 2 && check === remainder) || 
                    (remainder >= 2 && check === 11 - remainder);
    
    return isValid;
  };
  
  export const validatePhoneNumber = (phone: string): boolean => {
    // اعتبارسنجی شماره موبایل ایران
    const regex = /^09[0-9]{9}$/;
    return regex.test(phone);
  };
  
  export const validateVerificationCode = (code: string): boolean => {
    // کد تایید باید ۴ تا ۶ رقم باشد
    return /^\d{4,6}$/.test(code);
  };