import * as React from "react";

const useAutoFocus = (ref: React.RefObject<HTMLElement>, shouldFocus: boolean) => {
    React.useEffect(() => {
        if (ref.current && shouldFocus){
            ref.current.focus();
        }
    }, [])
};

export default useAutoFocus;