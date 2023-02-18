import TextField from "core/ui/fields/TextField";
import { createTsForm } from "@ts-react/form";
import { z } from "zod";

const mapping = [[z.string(), TextField]] as const; // 👈 `as const` is necessary
const Form = createTsForm(mapping);

export default Form;
