"use client";
import CrudComponent from "@/components/CrudComponent";
import { useRouter } from "next/navigation";

type Props = {
  params: { [key: string]: string | undefined };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function Page(props: Props) {
  const router = useRouter();
  const isEditMode = props.params.id !== "create";
  const title = isEditMode
    ? "Edit Phone Book Project Assignment"
    : "Create Phone Book Project Assignment";

  const navigateBack = () => {
    router.push("..");
  };

  return (
    <main>
      <div className="header">{title}</div>
      <div className="content">
        <CrudComponent id={props.params.id} navigateBack={navigateBack} isEditMode={isEditMode} />
      </div>
    </main>
  );
}
