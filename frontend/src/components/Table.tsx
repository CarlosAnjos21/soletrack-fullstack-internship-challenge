import React from "react";
import styles from "./Table.module.css";

interface Column<T> {
  header: string;
  accessor: keyof T | "actions";
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
}

function Table<T extends { [key: string]: any }>({
  columns,
  data,
}: TableProps<T>) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.accessor)}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td key={String(col.accessor)}>
                  {row[col.accessor as keyof T]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;