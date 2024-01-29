import { Table } from "@mantine/core";

export type PatientsType = {
  first_name: string;
  last_name: string;
  age: number | "";
  location: string;
  result: number;
};

type TableProps = {
  data: PatientsType[];
};

function PatientsTable({ data }: TableProps) {
  const rows = data.map((element, index) => (
    <tr key={index}>
      <td>{element.first_name}</td>
      <td>{element.last_name}</td>
      <td>{element.age}</td>
      <td>{element.location}</td>
      <td>{element.result}%</td>
    </tr>
  ));

  return (
    <Table>
      <thead>
        <tr>
          <th>First name</th>
          <th>Last name</th>
          <th>Age</th>
          <th>Location</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}

export default PatientsTable;
