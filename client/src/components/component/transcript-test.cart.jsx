import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEndpoint } from "@/components/wrapper/endpoint-context";
export function TranscriptTestCart({ transcriptTest }) {
  const router = useRouter();
  const { endpoint } = useEndpoint();
  const handleClick = () => {
    router.push(`/transcript-test/${transcriptTest.id}/listen-and-write`);
  };
  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-lg flex flex-col ">
      <div className="relative">
        <div className="aspect-[4/3] relative">
          <Image
            src={endpoint.originUrlUpload + transcriptTest.image}
            alt={transcriptTest.title}
            fill
            className="object-cover"
          />
        </div>
      </div>
      <div className="p-4 space-y-4  flex-1 flex flex-col justify-between">
        <h3 className="text-lg font-semibold">{transcriptTest.title}</h3>
        <Button
          className="w-full bg-primary hover:bg-primary/80"
          onClick={handleClick}
        >
          Làm bài
        </Button>
      </div>
    </div>
  );
}
