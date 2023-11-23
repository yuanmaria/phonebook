import type { Metadata } from "next";
import { globalStyles } from "@/styles/global";
import { SessionStorageProvider } from "@/context/SessionStorageContext";
import { ApolloWrapper } from "@/common/apollo-wrapper";
import { PhonebookProvider } from "@/context/PhonebookContext";
import { IconWrapper } from "@/common/IconWrapper";


export const metadata: Metadata = {
  title: "Phonebook",
  description: "Phonebook Project Assignment for GOTO",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body >
        {globalStyles}
        <SessionStorageProvider>
          <ApolloWrapper key={"apollo-wrapper"}>
            <IconWrapper>
            <PhonebookProvider>{children}</PhonebookProvider>
            </IconWrapper>
          </ApolloWrapper>
        </SessionStorageProvider>
      </body>
    </html>
  );
}
