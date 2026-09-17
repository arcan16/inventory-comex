/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

const ReportContext = createContext();

const initialReport = [];

const ReportProvider = ({ children }) => {
    const [report, setReport] = useState(initialReport);

    const handleReport = (reportData) => {
        setReport(reportData)
    }

    const data = {report, handleReport};

    return <ReportContext.Provider value={data}>{children}</ReportContext.Provider>
};

export {ReportProvider};

export default ReportContext;