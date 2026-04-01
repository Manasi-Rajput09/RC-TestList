import { useParams } from "react-router-dom";
import AlphaTasks from "./AlphaTasks";

export default function AppTasks() {
  const { id } = useParams();

  return <AlphaTasks appId={Number(id)} />;
}
