interface Props {
  params: Promise<{ id: string }>; // 👈 params is async
}

export default async function AboutUsPage({ params }: Props) {
  const { id } = await params; // 👈 wait for it

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold">Profile: {id}</h1>
      <p className="mt-4 text-lg">
        This is the profile page for {id}.
      </p>
    </div>
  );
}
