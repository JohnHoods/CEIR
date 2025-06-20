import { useEffect } from "react";
import { useRouter } from "next/router";

export default function withAuth(Component) {
  return function Protected(props) {
    const router = useRouter();
    useEffect(() => {
      const jwt = localStorage.getItem("jwt");
      if (!jwt) {
        router.replace("/login");
      }
    }, []);
    return <Component {...props} />;
  };
}
