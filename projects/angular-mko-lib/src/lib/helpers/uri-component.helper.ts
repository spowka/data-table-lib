import { Params } from "@angular/router";
import { GridRequestInterface } from "../models";

/**
 * Converts a GridRequestInterface object to Params object.
 * The Params object is suitable for use in HTTP requests or query parameters.
 *
 * @param input - The input GridRequestInterface object containing pagination and ordering information.
 * @returns A Params object derived from the input GridRequestInterface.
 */
export function convertGridRequestToParams(input: GridRequestInterface): Params {
  const result: Params = {
    page: input.page,
    limit: input.limit,
  }

  if (input.order) {
    result["order[by]"] = input.order.by;
    result["order[type]"] = input.order?.type
  }

  return result;
}

/**
 * Converts a Params object to a GridRequestInterface object.
 * The Params object is typically obtained from HTTP requests or query parameters.
 *
 * @param input - The input Params object containing page, limit, and optional order information.
 * @returns A GridRequestInterface object derived from the input Params.
 */
export function convertParamsToGridRequest(input: Params): GridRequestInterface {
  const result: GridRequestInterface = {
    page: Number(input["page"]),
    limit: Number(input["limit"]),
  }

  if (input["order[by]"]) {
    result["order"] = {
      by: input["order[by]"],
      type: input["order[type]"] || 'asc'
    }
  }

  return result;
}
