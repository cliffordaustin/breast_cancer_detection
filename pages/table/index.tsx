import { PatientsType } from "@/components/Table";
import axios, { AxiosError } from "axios";
import { GetServerSideProps } from "next";
import React from "react";
import { QueryClient, dehydrate, useQuery } from "react-query";
import PatientTable from "@/components/Table";

export const getPatients = async (): Promise<PatientsType[]> => {
  const patients = await axios.get(`http://127.0.0.1:8000/api/v1/patients/`);

  return patients.data.results;
};

export default function Table() {
  const { data: patients } = useQuery("patients", getPatients);

  return (
    <div className="px-8">
      {patients && <PatientTable data={patients}></PatientTable>}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryClient = new QueryClient();

  try {
    await queryClient.fetchQuery<PatientsType[]>("patients", getPatients);

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  } catch (error) {
    return {
      props: {},
    };
  }
};
