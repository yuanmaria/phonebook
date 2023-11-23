"use client";
import { Phonebook } from "@/common/types";
import { DELETE_CONTACT } from "@/constants/Queries";
import { usePhonebook } from "@/context/PhonebookContext";
import { useSessionStorage } from "@/context/SessionStorageContext";
import { useMutation } from "@apollo/client";
import { css } from "@emotion/react";
import Link from "next/link";
import { FaEdit, FaRegStar, FaStar, FaTrash } from "react-icons/fa";

/**
 * List Item Component
 */
export default function ListItemComponent({ item }: { item: Phonebook }) {
  const { updateSearchQuery } = usePhonebook();
  const { sessionData } = useSessionStorage();
  const [removeContact] = useMutation(DELETE_CONTACT);

  const handleFavorite = () => {
    let favList = sessionData?.favorite_list || [];
    if (!item.id) return;
    if (!item.is_favorite) {
      item.id && favList.push(item.id);
    } else {
      const index = favList.indexOf(item.id);
      favList.splice(index, 1);
    }
    updateSearchQuery({ favorite_list: favList });
  };

  const handleRemove = async () => {
    const spec = {
      id: item.id,
    };
    try {
      await removeContact({
        variables: {
          ...spec,
        },
      });
      alert("Data removed successfully!");
      updateSearchQuery({ favorite_list: sessionData?.favorite_list });
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  return (
    <tr>
      <td headers="fav">
        {item.is_favorite ? (
          <FaStar css={{ cursor: "pointer" }} onClick={handleFavorite} />
        ) : (
          <FaRegStar css={{ cursor: "pointer" }} onClick={handleFavorite} />
        )}
      </td>
      <td headers="id">{item.id}</td>
      <td headers="name">
        {item.first_name} {item.last_name}
      </td>
      <td headers="phone">
        {item.phones.length > 0
          ? item.phones.map((phone) => phone.number).join(", ")
          : "-"}
      </td>
      <td headers="created">{new Date(item.created_at).toLocaleString()}</td>
      <td
        headers="action"
        css={css(`display: flex; gap: 0.5rem;
      button {
        border-radius: 50px;
      }
      `)}
      >
        <Link href={`/${item.id}`} aria-label={"Edit Contact"}>
          <button aria-label={"Edit Contact Button"}>
            <FaEdit />
          </button>
        </Link>
        <button
          className="cancel"
          onClick={handleRemove}
          aria-label={"Remove Contact Button"}
        >
          <FaTrash />
        </button>
      </td>
    </tr>
  );
}
