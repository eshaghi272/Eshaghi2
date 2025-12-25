// src/hooks/useFormatters.ts
export const useFormatters = () => {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fa-IR', {
      // در پروژه واقعی باید از ریال استفاده کنید
      // اینجا به صورت نمادین تومان نشان می‌دهیم
      style: 'currency',
      currency: 'IRR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };
  
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('fa-IR').format(date);
  };
  
  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return { formatPrice, formatDate, truncateText };
};