import { initContract } from "@ts-rest/core";
import { authContract } from "./auth.contract";
import { essayContract } from "./essay.constract";

const c = initContract();

export const apiContracts = c.router({
  auth: authContract,
  essay: essayContract,
})
