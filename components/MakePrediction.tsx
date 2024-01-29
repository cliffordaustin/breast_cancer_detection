import {
  Button,
  Container,
  Divider,
  FileInput,
  Flex,
  Loader,
  NumberInput,
  Text,
  TextInput,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconUpload } from "@tabler/icons-react";
import axios from "axios";
import React, { useState } from "react";

type FormValues = {
  first_name: string;
  last_name: string;
  age: number | "";
  location: string;
};

function MakePrediction() {
  const form = useForm<FormValues>({
    initialValues: {
      first_name: "",
      last_name: "",
      age: "",
      location: "",
    },
  });

  const [files, setFiles] = React.useState<File>();

  const [noFiles, setNoFiles] = React.useState(false);

  const [loading, setLoading] = React.useState(false);

  const [loadingSubmit, setLoadingSubmit] = React.useState(false);

  const [prediction, setPrediction] = useState<number | null>(null);

  const submit = async () => {
    if (files) {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", files);
      const res = await axios.post(
        `http://localhost:8000/api/v1/make-prediction/`,
        formData
      );

      setPrediction(res.data.prediction);
      setLoading(false);
    }
  };

  const sumbitForm = async () => {
    setLoadingSubmit(true);
    await axios.post(`http://localhost:8000/api/v1/patients/`, {
      first_name: form.values.first_name,
      last_name: form.values.last_name,
      age: form.values.age,
      location: form.values.location,
      result: prediction,
    });
    setLoadingSubmit(false);
  };

  return (
    <div className="mt-6 flex gap-4">
      <Container w={450} className="p-4">
        <form className="flex flex-col gap-1">
          <TextInput
            label="First name"
            placeholder="Enter your first name"
            value={form.values.first_name}
            onChange={(event) =>
              form.setFieldValue("first_name", event.currentTarget.value)
            }
            required
          />

          <TextInput
            label="Last name"
            placeholder="Enter your last name"
            value={form.values.last_name}
            onChange={(event) =>
              form.setFieldValue("last_name", event.currentTarget.value)
            }
            required
          />

          <TextInput
            label="Location"
            placeholder="Enter your location"
            value={form.values.location}
            onChange={(event) =>
              form.setFieldValue("location", event.currentTarget.value)
            }
            required
          />

          <NumberInput
            label="Age"
            placeholder="Enter your age"
            value={form.values.age}
            onChange={(value) => form.setFieldValue("age", value)}
            required
          />

          <FileInput
            label="Image"
            placeholder="Select one image"
            accept="image/png, image/jpeg, image/jpg"
            icon={<IconUpload size={rem(14)} />}
            error={noFiles ? "Please select at least one file" : ""}
            onChange={(payload: File) => {
              setNoFiles(false);
              setFiles(payload);
            }}
            required
          />

          <Flex gap={8} justify="right" mt={6}>
            <Button
              onClick={() => {
                submit();
              }}
              disabled={loading}
            >
              Make Prediction{" "}
              {loading && <Loader size="xs" color="gray" ml={5}></Loader>}
            </Button>
          </Flex>
        </form>
      </Container>
      <Divider orientation="vertical"></Divider>
      <div className="flex-grow">
        {!form.values.first_name &&
          !form.values.last_name &&
          !form.values.age &&
          !form.values.location &&
          !files && (
            <Text className="text-center">
              Start typing to view summary here
            </Text>
          )}

        <div>
          <h1 className="text-3xl leading-3 font-black">
            {form.values.first_name} {form.values.last_name}
          </h1>

          <Text className="text-lg text-gray-500">{form.values.location}</Text>

          <Text className="text-lg text-gray-500">
            {form.values.age}
            {form.values.age && " years old"}
          </Text>
        </div>

        <Divider className="my-4"></Divider>

        <div>
          {/* <h1 className="text-2xl leading-3 font-black mt-4">Prediction</h1> */}
          {loading && (
            <div className="flex items-center justify-center">
              <Loader className=""></Loader>
            </div>
          )}
          {prediction !== null && (
            <div className="flex flex-col gap-6">
              <Text className="text-lg">
                <span
                  className={
                    "font-bold text-2xl " +
                    (prediction > 50 ? "text-red-500" : "text-green-500")
                  }
                >
                  {prediction}%
                </span>{" "}
                chance of breast cancer being IDC(Invasive ductal carcinoma)
              </Text>

              <Flex gap={8} justify="right" mt={6}>
                <Button
                  onClick={() => {
                    sumbitForm();
                  }}
                  disabled={loadingSubmit}
                >
                  Submit data
                </Button>
              </Flex>
            </div>
          )}
        </div>

        <Text></Text>
      </div>
    </div>
  );
}

export default MakePrediction;
