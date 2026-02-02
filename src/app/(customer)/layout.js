import { GeneralContextProvider } from "@/context/generalContext";
import CustomerClientWrapper from "@/components/(customer)/CustomerClientWrapper";
import { UIProvider } from "@/context/uiContext";
import LoginModal from "../auth/login/page";

export default function CustomerLayout({ children }) {
  return (
    <GeneralContextProvider>
      <UIProvider>
         <LoginModal/>
        <CustomerClientWrapper>{children}</CustomerClientWrapper>
      </UIProvider>
    </GeneralContextProvider>
  );
}
