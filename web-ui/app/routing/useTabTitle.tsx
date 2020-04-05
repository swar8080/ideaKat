import * as React from "react";

const useTabTitle = (title?: string, updateDependencies: any[] = []) => {    
    const displayedTitle = !!title? title : "ideaKat";
    React.useEffect(() => {
        document.title = displayedTitle;
    }, [...updateDependencies]);
}

export default useTabTitle;