import React from "react";
import { FormControl, FormErrorMessage, Text } from "@chakra-ui/react";
import { useField } from "formik";

function ProfilePictureInput({ label, ...props }) {
  const [field, meta] = useField(props);
  return (
    <>
      <FormControl isInvalid={meta.touched && meta.error ? true : false}>
        <label className="file-upload">
          <input {...field} {...props} className="input-file-upload" />
          <Text fontWeight="600" color="green.600">
            {label}
          </Text>
        </label>
        <FormErrorMessage fontSize="sm" mt={4}>
          {meta.error}
        </FormErrorMessage>
      </FormControl>
    </>
  );
}

export default ProfilePictureInput;
