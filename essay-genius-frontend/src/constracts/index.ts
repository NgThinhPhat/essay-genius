import { initContract } from "@ts-rest/core";
import { authContract } from "./auth.contract";
import { essayContract } from "./essay.constract";
import { interactionContract } from "./interaction.contrast";

const c = initContract();

export const apiContracts = c.router({
  auth: authContract,
  essay: essayContract,
  interaction: interactionContract
})
