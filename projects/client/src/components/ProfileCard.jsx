import React from "react";
import { Avatar, Box, Text, Stack, Button } from "@chakra-ui/react";
import { FormHelperText, Input, FormErrorMessage, FormControl } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { useFormik } from "formik";
import { profilePictureSchema } from "../schemas/profilePictureVal";

function ProfileCard(props) {
  const [isLoading, setIsLoading] = React.useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const onBtnUpdate = () => {
    console.log(values.image);
  };

  //Formik configuration
  const { values, errors, touched, handleBlur, setFieldValue, handleSubmit } = useFormik({
    initialValues: {
      image: undefined,
    },
    validationSchema: profilePictureSchema,
    onSubmit: onBtnUpdate,
  });
  return (
    <Box py={6}>
      <Box
        maxW={"320px"}
        w={"full"}
        bg="white"
        boxShadow={"sm"}
        rounded={"lg"}
        p={6}
        textAlign={"center"}
        border="1px"
        borderColor="blackAlpha.100"
      >
        <Avatar
          size={"4xl"}
          src={
            "https://images.unsplash.com/photo-1520810627419-35e362c5dc07?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
          }
          alt={"Avatar Alt"}
          pos={"relative"}
        />

        <Stack mt={8} direction={"column"} spacing={3}>
          <Button onClick={onOpen} colorScheme="green" variant="outline">
            Change Profile Picture
          </Button>

          <Modal onClose={onClose} isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Upload Picture</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <form onSubmit={handleSubmit}>
                  <FormControl isInvalid={errors.image && touched.image ? true : false}>
                    <Input
                      type="file"
                      _hover={{
                        cursor: "pointer",
                      }}
                      sx={{
                        "::file-selector-button": {
                          height: 10,
                          padding: 0,
                          mr: 4,
                          background: "none",
                          border: "none",
                          fontWeight: "bold",
                        },
                      }}
                      name="image"
                      onChange={(e) => setFieldValue("image", e.target.files[0])}
                      onBlur={handleBlur}
                    />
                    <FormErrorMessage fontSize="sm">{errors.image}</FormErrorMessage>
                    <FormHelperText mt={6}>
                      File Size: 1MB (Megabyte) maximum. File extension that are accepted: .JPG
                      .JPEG .PNG .GIF
                    </FormHelperText>
                  </FormControl>
                </form>
              </ModalBody>
              <ModalFooter gap={4}>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                  isLoading={isLoading}
                  isDisabled={errors.image && touched.image ? true : false}
                  type="submit"
                  onClick={onBtnUpdate}
                  colorScheme="green"
                >
                  Update
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Stack>
      </Box>
    </Box>
  );
}

export default ProfileCard;
