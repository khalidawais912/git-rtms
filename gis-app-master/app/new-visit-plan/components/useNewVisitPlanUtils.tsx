import { OptionType } from "@/app/components/Form/CustomSelect";
import useAuthentication from "@/app/hooks/useAuthentication";
import useDistrict from "@/app/hooks/useDistrict";
import useDriver from "@/app/hooks/useDriver";
import useTourPlans from "@/app/hooks/useTourPlans";
import useVehicle from "@/app/hooks/useVehicle";
import { useMemo } from "react";

const useNewVisitPlanUtils = () => {
  const { data: users } = useAuthentication();
  const { data: drivers } = useDriver();
  const { data: vehicles } = useVehicle();
  const { data: districts } = useDistrict();
  const { data: tours } = useTourPlans();

  const districtOptions: OptionType[] = districts.map((district) => {
    return {
      value: district.id.toString(),
      label: district.districtName,
    };
  });

  const userOptions: OptionType[] = users.map((user) => {
    return {
      value: user.id.toString(),
      label: user.fullName,
    };
  });

  const driverOptions: OptionType[] = drivers.map((driver) => {
    return {
      value: driver.id.toString(),
      label: driver.driverName,
    };
  });

  const vehicleOptions: OptionType[] = vehicles.map((vehicle) => {
    return {
      value: vehicle.id.toString(),
      label: vehicle.vehicleNumber,
    };
  });

  const tourOptions: OptionType[] = tours.map((tour) => {
    return {
      value: String(tour.id),
      label: tour.name,
    };
  });

  const typeStatusOptions: OptionType[] = [
    { value: "0", label: "Monitoring" },
    { value: "1", label: "Evaluation" },
    { value: "2", label: "MonitoringAndCMInitiative" },
  ];
  return {
    districtOptions,
    userOptions,
    driverOptions,
    vehicleOptions,
    tourOptions,
    typeStatusOptions,
  };
};

export default useNewVisitPlanUtils;
