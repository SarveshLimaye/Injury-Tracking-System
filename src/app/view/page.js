"use client";
import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { userMailtoId, User } from "../../../graphql/queries";
import Loading from "../../components/Loading/Loading";

import ReportCard from "../../components/ReportCard/ReportCard";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Grid,
  GridItem,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useUser } from "@auth0/nextjs-auth0/client";
import NoReports from "../../components/NoReports/NoReports";

export default function View() {
  const { user } = useUser();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState();
  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery(userMailtoId, {
    variables: { email: user?.email },
    skip: !user,
  });

  const userId = userData?.userMailtoId;

  const {
    data: reportsData,
    loading: reportsLoading,
    error: reportsError,
  } = useQuery(User, {
    variables: { id: userId },
    skip: !userId, // Skip the query if userId is not available yet
  });

  useEffect(() => {
    if (userLoading) {
      // Loading state while fetching user's ID
      setIsLoading(true);
    } else if (userError) {
      // Handle error while fetching user's ID
    } else if (reportsLoading) {
      // Loading state while fetching user's reports
      setIsLoading(true);
    } else if (reportsError) {
      // Handle error while fetching user's reports
      setError(reportsError);
    } else {
      // Access user data and reports data here

      const user = reportsData?.user;

      const reports = user?.reports;
      setReports(reports);
      setIsLoading(false);
      // Process and use the user and reports data as needed
    }
  }, [userLoading, userError, reportsLoading, reportsError, reportsData]);

  const columns = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 3 });
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <Grid templateColumns={`repeat(${columns}, 1fr)`} gap={4} p={4} mt={5}>
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
