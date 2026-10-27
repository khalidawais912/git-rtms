"use client";
import useNewVisitPlanUtils from "./useNewVisitPlanUtils";
import EvaluationVisitPlanList from "./VisitPlanEvaluation/EvaluationVisitPlanList";
import MonitoringVisitPlanList from "./VisitPlanMonitoring/MonitoringVisitPlanList";

const NewVisitPlan = ({ currentType }: { currentType: string | undefined }) => {
  const {
    districtOptions,
    driverOptions,
    tourOptions,
    userOptions,
    vehicleOptions,
    typeStatusOptions,
  } = useNewVisitPlanUtils();

  return (
    <>
      {currentType ? (
        <EvaluationVisitPlanList
          dashboardType={currentType}
          typeStatusOptions={typeStatusOptions}
          districtOptions={districtOptions}
          driverOptions={driverOptions}
          tourOptions={tourOptions}
          userOptions={userOptions}
          vehicleOptions={vehicleOptions}
        />
      ) : (
        <MonitoringVisitPlanList
          dashboardType={currentType}
          typeStatusOptions={typeStatusOptions}
          districtOptions={districtOptions}
          driverOptions={driverOptions}
          tourOptions={tourOptions}
          userOptions={userOptions}
          vehicleOptions={vehicleOptions}
        />
      )}
    </>
  );
};

export default NewVisitPlan;
