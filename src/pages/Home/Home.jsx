import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import axiosInstance from "../../utils/axiosInstance";
import TravelStoryCard from "../../components/TravelStoryCard";
import { toast, ToastContainer } from "react-toastify";
import { IoMdAdd } from "react-icons/io";
import AddEditTravelStory from "../../components/AddEditTravelStory";
import Modal from "react-modal";
import ViewTravelStory from "./ViewTravelStory";
import { data } from "react-router-dom";
import EmptyCard from "../../components/EmptyCard";
import { DayPicker } from "react-day-picker";
import moment from "moment";
import FilterInfoTitle from "../../components/FilterInfoTitle";
import { getEmptyCardMessage } from "../../utils/helper";

Modal.setAppElement("#root");

const Home = () => {
  const [allStories, setAllStories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");

  const [dateRange, setDateRange] = useState({ from: null, to: null });
  // console.log(allStories);
  const [openAddEditModel, setOpenAddEditModel] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [openViewModal, setOpenaViewModal] = useState({
    isShown: false,
    data: null,
  });
  //Get all travel stories
  const GetAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get("travel-story/get-all");

      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log("Something went wrong. Please Try again");
    }
  };
  //Handle edit story
  const handleEdit = async (data) => {
    setOpenAddEditModel({ isShown: true, type: "edit", data: data });
  };

  const handleViewStory = (data) => {
    setOpenaViewModal({ isShown: true, data });
  };
  const updateIsFavourite = async (storyData) => {
    const storyId = storyData._id;

    try {
      const response = await axiosInstance.put(
        "/travel-story/update-is-favourite/" + storyId,
        {
          isFavourite: !storyData.isFavourite,
        }
      );
      if (response.data && response.data.story) {
        toast.success("Story updated successfully");
        GetAllTravelStories();
      }
    } catch (error) {
      console.log("Something went wrong. Please Try again");
    }
  };
  //Delete story
  const deleteTravelStory = async (data) => {
    const storyId = data._id;
    try {
      const response = await axiosInstance.delete(
        "/travel-story/delete-story/" + storyId
      );

      if (response.data && !response.data.error) {
        toast.success("Story deleted successfully!");

        setOpenaViewModal((prevState) => ({ ...prevState, isShown: false }));
        GetAllTravelStories();
      }
    } catch (error) {
      console.log("Something went wrong please try again");
    }
  };
  //Search story
  const onSearchStory = async (query) => {
    try {
      const response = await axiosInstance.get("/travel-story/search", {
        params: {
          query: query,
        },
      });
      if (response.data && response.data.stories) {
        setFilterType("search");
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log("Something went Wrong ");
    }
  };

  //Clear search
  const handleClearSearch = () => {
    setFilterType("");
    GetAllTravelStories();
  };
  //Handle filter travel story by date range
  const filterStoriesByDate = async (day) => {
    try {
      const startDate = day.from ? moment(day.from).valueOf() : null;
      const endDate = day.to ? moment(day.to).valueOf() : null;
      if (startDate && endDate) {
        const response = await axiosInstance.get("/travel-story/filter", {
          params: { startDate, endDate },
        });
        if (response.data && response.data.stories) {
          setFilterType("date");
          setAllStories(response.data.stories);
        }
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.");
    }
  };
  //Handle date range click'
  const handleDayClick = (day) => {
    setDateRange(day);
    filterStoriesByDate(day);
  };
  const  resetFilter = ()=>{
      setDateRange({from: null, to:null })
      setFilterType("")
      GetAllTravelStories()
  }
  useEffect(() => {
    GetAllTravelStories();

    return () => {};
  }, []);

  return (
    <>
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={onSearchStory}
        handleClearSearch={handleClearSearch}
      />

      <div className="container mx-auto py-10">
        <FilterInfoTitle
          filterType={filterType}
          filterDate={dateRange}
          onClear={() => {
            resetFilter();
          }}
        />

        <div className="flex gap-7">
          <div className="flex-1">
            {allStories.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {allStories.map((item) => {
                  return (
                    <TravelStoryCard
                      key={item.id}
                      imageUrl={item.imageUrl}
                      title={item.title}
                      story={item.story}
                      date={item.visitedDate}
                      visitedLocation={item.visitedLocation}
                      isFavourite={item.isFavourite}
                      onEdit={() => handleEdit(item)}
                      onClick={() => handleViewStory(item)}
                      onFavouriteClick={() => updateIsFavourite(item)}
                    />
                  );
                })}
              </div>
            ) : (
              <EmptyCard
                imgSrc={
                  "https://images.pexels.com/photos/5706017/pexels-photo-5706017.jpeg?_gl=1*1w080s7*_ga*MTkyNzAzNzE5OC4xNzYwMTkxNzEz*_ga_8JE65Q40S6*czE3NjAxOTE3MTMkbzEkZzEkdDE3NjAxOTE3NjUkajgkbDAkaDA."
                }
                message={getEmptyCardMessage(filterType)}
                setOpenAddEditModel={() =>
                  setOpenAddEditModel({
                    isShown: true,
                    type: "add",
                    data: null,
                  })
                }
              />
            )}
          </div>
          <div className="w-[320px]">
            <div className="bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">
              <div className="p-3">
                <DayPicker
                  captionLayout="dropdown"
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDayClick}
                  pagedNavigation
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*Add and Edit Travel story modal */}
      <Modal
        isOpen={openAddEditModel.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="modal-box"
      >
        <AddEditTravelStory
          storyInfo={openAddEditModel.data}
          type={openAddEditModel.type}
          onClose={() => {
            setOpenAddEditModel({ isShown: false, type: "add", data: null });
          }}
          GetAllTravelStories={GetAllTravelStories}
        />
      </Modal>

      {/* View TravelStory Model */}
      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="modal-box"
      >
        <ViewTravelStory
          storyInfo={openViewModal.data || null}
          onClose={() => {
            setOpenaViewModal((prevState) => ({
              ...prevState,
              isShown: false,
            }));
          }}
          onEditClick={() => {
            setOpenaViewModal((prevState) => ({
              ...prevState,
              isShown: false,
            }));
            handleEdit(openViewModal.data || null);
          }}
          onDeleteClick={() => {
            deleteTravelStory(openViewModal.data || null);
          }}
        />
      </Modal>
      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-[#05b6d3] hover:bg-cyan-400 fixed right-10 buttom-10"
        onClick={() => {
          setOpenAddEditModel({ isShown: true, type: "add", data: null });
        }}
      >
        <IoMdAdd className="text-[32px] text-white" />
      </button>

      <ToastContainer />
    </>
  );
};

export default Home;
