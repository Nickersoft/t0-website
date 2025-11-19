import { getAllCountryData, getCurrencyData } from "country-currency-utils";

import * as FLAGS from "country-flag-icons/react/1x1";

const COUNTRY_DATA = getAllCountryData();

const FLAG_OVERRIDES: Record<string, FLAGS.FlagComponent> = {
  USD: FLAGS.US,
  EUR: FLAGS.EU,
};

export function getFlagForCurrency(code: string): FLAGS.FlagComponent {
  let flag = FLAG_OVERRIDES?.[code];

  if (!flag) {
    const country = COUNTRY_DATA.find(
      ({ currencyCode }) => currencyCode === code,
    );

    if (!country) {
      throw new Error(
        `Couldn't find a country that uses the currency: ${code}`,
      );
    }

    flag =
      FLAG_OVERRIDES?.[code] ??
      FLAGS[country.countryCode as keyof typeof FLAGS];
  }

  return flag;
}

export function getCurrency(code: string) {
  return {
    ...getCurrencyData(code),
    flag: getFlagForCurrency(code),
  };
}
