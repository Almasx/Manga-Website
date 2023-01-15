import { createTsForm } from "@ts-react/form";
import { z } from "zod";
import TextField from "../atoms/TextField";

const mapping = [[z.string(), TextField]] as const; // 👈 `as const` is necessary
const Form = createTsForm(mapping);

export default Form;
