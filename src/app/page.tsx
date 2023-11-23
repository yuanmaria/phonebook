import dynamic from "next/dynamic";

const NoSSR = dynamic(() => import("./HomeContainer"), { ssr: false });

export default async function Page() {
  return (
    <main>
      <div className="header">Phone Book Project Assignment</div>
      <div className="content">
        <NoSSR />
      </div>
    </main>
  );
}
