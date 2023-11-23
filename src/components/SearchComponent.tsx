"use client";

import { usePhonebook } from "@/context/PhonebookContext";
import { useSessionStorage } from "@/context/SessionStorageContext";
import Link from "next/link";
import { useRef } from "react";
import { FaSearch } from "react-icons/fa";

/**
 * Phonebook Search Component
 */
export default function SearchComponent() {
  const formRef = useRef<HTMLFormElement>(null);
  const { resetSearchQuery, updateSearchQuery } = usePhonebook();
  const { sessionData } = useSessionStorage();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(formRef.current!);
    const search_text = form.get("search_text");
    if (search_text) {
      updateSearchQuery({search_text: search_text.toString(), favorite_list: sessionData?.favorite_list});
    } else {
      resetSearchQuery();
    }
  };

  return (
    <div
      css={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "2rem",
        alignItems: "center"
      }}
    >
      <form ref={formRef} onSubmit={handleSubmit}>
        <div
          css={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <label htmlFor="search_text">Search</label>
          <input
            css={{ fontSize: "14px" }}
            id="search_text"
            name="search_text"
            defaultValue={sessionData?.search_text}
          />
          <button
            css={{
              border: "none",
              backgroundColor: "var(--background-header-color)",
              cursor: "pointer",
              borderRadius: "50px",
              width: "20px",
              height: "20px;",
              padding: "0px"
            }}
            type="submit"
            aria-label={'Search Button'}
          >
            <FaSearch />
          </button>
        </div>
      </form>
      <Link href="/create" aria-label={'Create Contact'}>
        <button aria-label={'Create Contact Button'}>Create Contact</button>
      </Link>
    </div>
  );
}
