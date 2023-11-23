"use client";

import SearchComponent from "@/components/SearchComponent";
import { useSessionStorage } from "@/context/SessionStorageContext";
import ListItemComponent from "@/components/ListItemComponent";
import PaginationComponent from "@/components/PaginationComponent";
import { css } from "@emotion/react";
import mq from "@/constants/StyleConstant";
import { PER_PAGE } from "@/constants/Queries";
import { FaStar } from "react-icons/fa";

export default function HomeContainer() {
  const { sessionData } = useSessionStorage();
  const renderTable = () => {
    return sessionData?.contact?.map((item, index) => {
      if (index < PER_PAGE) {
        return <ListItemComponent item={item} key={item.id} />;
      }
    });
  };

  return (
    <div>
      <SearchComponent />
      <table
        width={"100%"}
        css={css(`
        border: solid 1px var(--border-color);
        background-color: var(--background-color);
        margin-bottom: 1rem;
        th {
          font-size: 12px;
          line-height: 14px;
          font-weight: 700;
          padding: 0.5rem;
          text-align: left;
          ${mq[1]} {
            font-size: 14px;
            line-height: 16px;
          }
        }
        td {
          color: var(--secondary-text-color);
          padding: 0.5rem;
          vertical-align: top;
          border-top: var(--secondary-text-color) 1px dashed;
        }
      `)}
      >
        <colgroup>
       <col span={1} style={{width: "5%"}} />
       <col span={1} style={{width: "10%"}} />
       <col span={1} style={{width: "40%"}} />
       <col span={1} style={{width: "25%"}} />
       <col span={1} style={{width: "15%"}} />
       <col span={1} style={{width: "5%"}} />
    </colgroup>
        <thead>
          <tr>
            <th scope="col" id="fav"><FaStar /></th>
            <th scope="col" id="id">ID</th>
            <th scope="col" id="name">Name</th>
            <th scope="col" id="phone">Phone Number</th>
            <th scope="col" id="created">Created At</th>
            <th scope="col" id="action">Action</th>
          </tr>
        </thead>
        <tbody>
        {renderTable()}
        </tbody>
      </table>
      <PaginationComponent />
    </div>
  );
}
