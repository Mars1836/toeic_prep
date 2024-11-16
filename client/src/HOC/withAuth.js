import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, ComponentType } from "react";

function withAuth(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const user = useSelector((state) => state.user.data);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      if (!user) {
        router.push(`/account?redirect=${pathname}`); // Redirect to login page if not authenticated
      }
    }, [user, router]);

    if (!user) {
      return null; // Hiển thị trống hoặc loading trong khi đợi redirect
    }

    return <WrappedComponent {...props} />;
  };
}

export default withAuth;
