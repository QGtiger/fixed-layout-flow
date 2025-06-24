import { AuthLoginLayout } from "@/Layouts/AuthLogin";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

export default function Flow() {
  const nav = useNavigate();
  return (
    <AuthLoginLayout>
      <Button
        onClick={() => {
          nav("/studio/828875292346658816");
        }}
      >
        Flow
      </Button>
    </AuthLoginLayout>
  );
}
