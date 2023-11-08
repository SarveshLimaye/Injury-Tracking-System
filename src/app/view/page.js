"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { userMailtoId, User } from "../../../graphql/queries";
import Loading from "../../components/Loading/Loading";
import ReportCard from "../../components/ReportCard/ReportCard";
import AuthError from "../../components/AuthError/AuthError";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Grid,
  GridItem,
  useBreakpointValue,
  Input,
  FormControl,
  Select, // Import Select component from Chakra UI
} from "@chakra-ui/react";
import { useUser } from "@auth0/nextjs-auth0/client";
import NoReports from "../../components/NoReports/NoReports";

export default function View() {
  const { user } = useUser();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(""); // State for the start date
  const [endDate, setEndDate] = useState(""); // State for the end date
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [sortOption, setSortOption] = useState("createdAt"); // State for sorting option

  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery(userMailtoId, {
    variables: { email: user?.email },
    skip: !user?.email,
  });

  console.log(userLoading);
  console.log(userError);
  const userId = userData?.userMailtoId;

  console.log(userError);

  const {
    data: reportsData,
    loading: reportsLoading,
    error: reportsError,
  } = useQuery(User, {
    variables: { id: userId },
    skip: !userId,
  });

  console.log(reportsData);

  useEffect(() => {
    if (userLoading || reportsLoading) {
      setIsLoading(true);
    } else if (userError || reportsError) {
      // Handle errors
    } else {
      const user = reportsData?.user;
      const reports = user?.reports;
      setReports(reports);
      setIsLoading(false);
    }
  }, [
    userLoading,
    userError,
    reportsLoading,
    reportsError,
    reportsData,
    startDate,
    endDate,
  ]);

  const columns = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 3 });

  // Function to filter reports based on the date range
  const filterReports = () => {
    if (startDate && endDate) {
      const filteredReports = reports.filter((report) => {
        const reportDate = new Date(+report.createdAt);
        const startFilterDate = new Date(startDate);
        const endFilterDate = new Date(endDate);

        return reportDate >= startFilterDate && reportDate <= endFilterDate;
      });

      setReports(filteredReports);
    }
  };

  const searchReportsWithQuery = () => {
    // Create a copy of the original reports to reset when needed
    let filteredReports = [...reports];
    if (startDate && endDate) {
      // Filter by date range if dates are provided
      filteredReports = filteredReports.filter((report) => {
        const reportDate = new Date(+report.createdAt);
        const startFilterDate = new Date(startDate);
        const endFilterDate = new Date(endDate);

        return reportDate >= startFilterDate && reportDate <= endFilterDate;
      });
    }

    let fileteredreport2 = [...filteredReports];
    if (searchQuery) {
      // Filter by search query
      fileteredreport2 = filteredReports.filter((report) => {
        // Add your search logic here (e.g., report.bodyPart or report.content)
        return (
          report.bodyPart.includes(searchQuery) ||
          report.content.includes(searchQuery)
        );
      });
    }

    if (!searchQuery) {
      setReports(filteredReports);
    } else {
      setReports(fileteredreport2);
    }
  };

  const sortReports = () => {
    // Create a copy of the current reports for sorting
    const sortedReports = [...reports];

    // Sort based on the selected option
    if (sortOption === "createdAt") {
      sortedReports.sort(
        (a, b) => new Date(+a.createdAt) - new Date(+b.createdAt)
      );
    } else if (sortOption === "bodyPart") {
      sortedReports.sort((a, b) => a.bodyPart.localeCompare(b.bodyPart));
    } else if (sortOption === "content") {
      sortedReports.sort((a, b) => a.content.localeCompare(b.content));
    }

    // Update the reports with the sorted array
    setReports(sortedReports);
  };

  console.log(reports);

  if (user === undefined) {
    return <AuthError />;
  } else {
    return (
      <>
        <FormControl>
          <Flex justifyContent="space-between" mx={3}>
            <Input
              type="datetime-local"
              placeholder="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              mx={3}
              my={2}
            />
            <Input
              type="datetime-local"
              placeholder="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              mx={3}
              my={2}
            />
            <Button onClick={filterReports} my={2} px={7} py={3}>
              Filter
            </Button>
          </Flex>
          <Flex justifyContent="space-between" mx={3}>
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              mx={3}
              my={2}
            />
            <Button onClick={searchReportsWithQuery} my={2} px={7} py={3}>
              Search
            </Button>
            <Select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              mx={3}
              my={2}
            >
              <option value="createdAt">Sort by Date</option>
              <option value="bodyPart">Sort by Body Part</option>
              <option value="content">Sort by Content</option>
            </Select>
            <Button my={2} px={7} py={3} onClick={sortReports}>
              Sort
            </Button>
          </Flex>
        </FormControl>

        {isLoading ? (
          <Loading />
        ) : (
          <Grid
            templateColumns={`repeat(${columns}, 1fr)`}
            gap={4}
            p={4}
            mt={5}
          >
            {reports?.map((report, index) => (
              <GridItem key={report.id}>
                <ReportCard
                  index={index}
                  reportId={report.id}
                  bodyPart={report.bodyPart}
                  content={report.content}
                  createdAt={report.createdAt}
                />
              </GridItem>
            ))}
          </Grid>
        )}
        {reports?.length === 0 ? <NoReports /> : null}
      </>
    );
  }
}
