"use client";
import { PhonebookContext } from "@/constants/types";
import { PER_PAGE } from "@/constants/Queries";
import { usePhonebook } from "@/context/PhonebookContext";
import { useSessionStorage } from "@/context/SessionStorageContext";
import { css } from "@emotion/react";
import { useEffect, useState } from "react";

/**
 * Pagination Component
 */
export default function PaginationComponent() {
  const [currPage, setCurrPage] = useState(0);
  const [nextPage, setNextPage] = useState(true);
  const { updateSearchQuery } = usePhonebook();
  const { sessionData } = useSessionStorage();

  useEffect(() => {
    setCurrPage(0);
  }, [sessionData?.search_text, sessionData?.favorite_list?.length])

  useEffect(() => {
    let favoriteOffset = sessionData?.offset_favorite || 0;
    let offset = sessionData?.offset || 0;
    setCurrPage((favoriteOffset + offset) / PER_PAGE);
  }, []);

  useEffect(() => {
    if (sessionData?.contact?.length === PER_PAGE + 1) {
      setNextPage(true);
    } else {
      setNextPage(false);
    }
  }, [sessionData]);

  const navigateNext = () => {
    setCurrPage(currPage + 1);
    if(sessionData) {
      let favoriteOffset = sessionData.offset_favorite || 0;
      let offset = sessionData.offset || 0;
      let favoriteCount = 0;
      let normalCount = 0;
      for(let i = 0; i<sessionData.contact.length -1; i++) {
        if(sessionData.contact[i].is_favorite) {favoriteCount++} else {normalCount++}
      }
      favoriteOffset = favoriteOffset + favoriteCount ;
      offset = offset + normalCount;
      const queryData = {
        offset: offset,
        offset_favorite: favoriteOffset,
        search_text: sessionData.search_text || "",
        limit: sessionData.limit,
        favorite_list: sessionData.favorite_list
      } as PhonebookContext;
      updateSearchQuery(queryData);
    }
  };

  const navigatePrev = () => {
    setCurrPage(currPage - 1);
    if(sessionData) {
      let favoriteOffset = sessionData.offset_favorite || 0;
      let offset = sessionData.offset || 0;
      const tempOffset = offset - PER_PAGE;
      let limit = sessionData.limit;

      if(tempOffset < 0) {
        favoriteOffset = favoriteOffset + tempOffset;
        limit = offset;
        offset = 0;
      } else {
        offset = tempOffset;
      }
      const queryData = {
        offset: offset,
        offset_favorite: favoriteOffset,
        search_text: sessionData.search_text || "",
        limit: limit,
        favorite_list: sessionData.favorite_list
      } as PhonebookContext;
      updateSearchQuery(queryData);
    }
  };

  const generatePage = () => {
    let totalPage = currPage + 2;
    if (!nextPage) {
      totalPage = currPage + 1;
    }
    return Array.from(Array(totalPage).keys());
  };

  return (
    <div
      css={css(`
        display: flex;
        gap: 0.25rem;
        align-item:center;
        justify-content: flex-end;
        button {
            background-color: var(--background-header-color);
        }
        .activePage {
            background-color: var(--highlight-color);
        }
    `)}
    >
      <button onClick={navigatePrev} disabled={currPage < 1} aria-label={'btn-prev'}>
        Prev
      </button>
      {generatePage().map((val) => {
        return (
          <button
            className={currPage === val ? "activePage" : ""}
            key={val}
            aria-label={`btn-page-${val}`}
          >
            {val + 1}
          </button>
        );
      })}
      <button onClick={navigateNext} disabled={!nextPage} aria-label={'btn-next'}>
        Next
      </button>
    </div>
  );
}
