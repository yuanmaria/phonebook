"use client";
import mq from "@/constants/StyleConstant";
import { css, Global } from "@emotion/react";

export const globalStyles = (
  <Global
    key={"global-style"}
    styles={css`
      :root {
        --background-color: #F9F7F7;
        --background-header-color: #DBE2EF;
        --background-card-color: #FFFFFF;
        --text-color: #112D4E;
        --secondary-text-color: #3F72AF;
        --border-color: #DBE2EF;
        --highlight-color: #9dc0eb;
      }

      @media (prefers-color-scheme: dark) {
        :root {
          --background-color: #333333;
          --background-header-color: #3F72AF;
          --background-card-color: #112D4E;
          --text-color: #F9F7F7;
          --secondary-text-color: #DBE2EF;
          --border-color: #3F72AF;
          --highlight-color: #9dc0eb;
        }
      }

      * {
        box-sizing: border-box;
        padding: 0;
        margin: 0;
        font-family: system-ui;
      }

      html,
      body {
        max-width: 100vw;
        overflow-x: hidden;
      }

      body {
        color: var(--text-color);
        background-color: var(--background-color);
        font-size: 12px;
        line-height: 14px;
        ${mq[1]} {
          font-size: 14px;
          line-height: 16px;
        }
      }

      .header {
        background-color: var(--background-header-color);
        width: 100%;
        padding: 0.5rem;
        margin-bottom: 1rem;
        font-size: 18px;
        line-height: 20px;
        font-weight: 700;
        ${mq[1]} {
          padding: 0.5rem 1rem;
          margin-bottom: 2rem;
          font-size: 24px;
          line-height: 26px;
        }
      }

      .content {
        background-color: var(--background-card-color);
        width: 100%;
        margin: 0px auto;
        padding: 0.5rem;
        border-radius: 4px;
        border: solid 1px var(--border-color);
        ${mq[1]} {
          width: 70%;
        }
      }

      .secondary {
        color: var(--secondary-text-color);
        font-size: 10px;
        line-height: 12px;
      }

      a {
        color: inherit;
        te
        xt-decoration: none;
      }
      button {
        border: none;
        background-color: var(--highlight-color);
        cursor: pointer;
        border-radius: 4px;
        padding: 0.5rem;
        width: fit-content;
      }
      .cancel {
        background-color: var(--border-color);
      }

      @media (prefers-color-scheme: dark) {
        html {
          color-scheme: dark;
        }
      }
    `}
  />
);
