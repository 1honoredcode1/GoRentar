import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import { assets } from "../assets/assets";

import Title from "../components/extra/Title";
import CarCard from "../components/extra/CarCard";

import { useAppContext } from "../context/AppContext";

const Cars = () => {
  const [input, setInput] = useState("");
  const [filteredCars, setFilteredCars] = useState([]);

  const { cars, axios } = useAppContext();

  const [searchParams] = useSearchParams();
  const pickupLocation = searchParams.get("PickupLocation");
  const pickupDate = searchParams.get("PickupDate");
  const returnDate = searchParams.get("ReturnDate");

  const isSearchData = pickupLocation && pickupDate && returnDate;

  const applyFilter = () => {
    if (!cars?.length) return;

    if (input.trim() === "") {
      setFilteredCars(cars);
      return;
    }

    const query = input.toLowerCase();

    const filtered = cars.filter((car) => {
      return (
        car.brand?.toLowerCase().includes(query) ||
        car.model?.toLowerCase().includes(query) ||
        car.category?.toLowerCase().includes(query) ||
        car.transmission?.toLowerCase().includes(query)
      );
    });

    setFilteredCars(filtered);
  };

  const searchCaraAvailability = async () => {
    try {
      const { data } = await axios.post("/api/bookings/check-availability", {
        location: pickupLocation,
        pickupDate,
        returnDate,
      });

      if (!data.success) {
        toast.error(data.message || "Failed to check availability");
        return;
      }

      const availableCars = data.availableCars || [];
      setFilteredCars(availableCars);

      if (availableCars.length === 0) {
        toast("No cars available for the selected dates and location");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };
  useEffect(() => {
    if (isSearchData) {
      searchCaraAvailability();
    }
  }, []);

  useEffect(() => {
    cars.length > 0 && !isSearchData && applyFilter();
  }, [input, cars]);

  return (
    <div className="">
      <div className="flex flex-col items-center py-20 bg-light max-md:px-4">
        <Title
          title="Available Cars"
          subtitle="Browse our selection of available vehicles"
        />
        <div className="flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow">
          <img
            src={assets.search_icon}
            alt="search"
            className="w-4.5 h-4.5 mr-2"
          />
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text "
            placeholder="Search by make, model or features"
            className="w-full h-full outline-none text-gray-500"
          />
          <img
            src={assets.filter_icon}
            alt="filter"
            className="w-4.5 h-4.5 ml-2"
          />
        </div>
      </div>
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10">
        <p className="text-gray-500 xl:px-20 max-w-7xl mx-auto">
          Showing {filteredCars.length} cars{" "}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto">
          {filteredCars.map((car, index) => (
            <div key={index}>
              <CarCard car={car} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cars;
