import Image from "next/image";
import { Button } from "@/components/ui/button";
import { originUrlUpload } from "@/consts";
import { useRouter } from "next/navigation";
export function TranscriptTestCart({ transcriptTest }) {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/transcript-test/${transcriptTest.id}/listen-and-write`);
  };
  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-lg">
      <div className="relative">
        <div className="aspect-[4/3] relative">
          <Image
            src={originUrlUpload + transcriptTest.image}
            alt={transcriptTest.title}
            fill
            className="object-cover"
          />
        </div>
      </div>
      <div className="p-4 space-y-4">
        <h3 className="text-lg font-semibold">{transcriptTest.title}</h3>
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={handleClick}
        >
          Làm bài
        </Button>
      </div>
    </div>
  );
}
