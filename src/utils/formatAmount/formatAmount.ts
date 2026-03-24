export const formatAmount = (number: number) =>
  number?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export const formatAmountForm = (number: string) => {
  const cleanedString = number?.replace(/[^0-9]/g, ""); // Faqat raqamlarni saqlang
  return cleanedString?.replace(/\B(?=(\d{3})+(?!\d))/g, " "); // 3 xonalik ajratmalar
};

export const resetAmountForm = (number: string) => number?.replace(/\s+/g, ""); // Bo'sh joylarni olib tashlang
