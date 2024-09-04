import { baseTypes } from "./base.type";
import { inputsTypes } from "./inputs.type";
import { pricesTypes } from "./prices.type";
import { productsTypes } from "./products.type";
import { responseUnion } from "./response.union";
import { salesTypes } from "./sales.type";

export const typeDefs = `
  ${productsTypes}

  ${pricesTypes}

  ${salesTypes}

  ${inputsTypes}

  ${responseUnion}

  ${baseTypes}
`;
