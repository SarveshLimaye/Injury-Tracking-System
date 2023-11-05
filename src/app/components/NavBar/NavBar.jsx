"use client";
import { useEffect } from "react";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Link,
  Icon,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { HamburgerIcon, CloseIcon, AddIcon } from "@chakra-ui/icons";
import { CgProfile } from "react-icons/cg";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_USER } from "../../../../graphql/mutation";
import { countUsersWithEmail } from "../../../../graphql/queries";
import Avatar from "avataaars";
import { generateRandomAvatarOptions } from "../../../utils/avatar";
import { useUser } from "@auth0/nextjs-auth0/client";
import { px } from "framer-motion";

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, isLoading } = useUser();
  const router = useRouter();

  return (
    <>
      <Box bg={useColorModeValue("white", "gray.800")} px={10}>
        <Flex
          h={16}
          alignItems="center"
          justifyContent="space-between"
          mx="auto"
        >
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack
            spacing={8}
            alignItems={"center"}
            fontSize="26px"
            fontWeight="0"
            ml="2"
            color="brand.00"
          >
            <Link href="/">SafeTrack</Link>
          </HStack>
          <Flex alignItems={"center"}>
            <div style={{ display: "flex" }}>
              <HStack
                as={"nav"}
                spacing={4}
                display={{ base: "none", md: "flex" }}
                marginRight={4}
              >
                <Link href="/add">
                  <Button w="full" variant="ghost">
                    Add Report
                  </Button>
                </Link>
              </HStack>
              <HStack
                as={"nav"}
                spacing={4}
                display={{ base: "none", md: "flex" }}
                marginRight={4}
              >
                <Link href="/view">
                  <Button w="full" variant="ghost">
                    View My Reports
                  </Button>
                </Link>
              </HStack>
            </div>

            {user == null ? (
              <Button
                display="flex"
                flexDir="row"
                variant={"solid"}
                colorScheme={"teal"}
                size={"sm"}
                mr={4}
                leftIcon={<Icon as={CgProfile} boxSize={6} />}
                onClick={() => router.push("/api/auth/login")}
              >
                Sign In
              </Button>
            ) : (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar
                    size={"sm"}
                    style={{
                      width: "40px",
                      height: "40px",
                    }}
                    avatarStyle="Circle"
                    {...generateRandomAvatarOptions()}
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem>Welcome, {user.name}</MenuItem>
                  <MenuDivider />
                  <MenuItem as={Link} to="/profile">
                    Profile
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={() => router.push("/api/auth/logout")}>
                    Sign Out
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              <Link href="/add">
                <Button w="full" variant="ghost">
                  Add Report
                </Button>
              </Link>
            </Stack>
            <Stack as={"nav"} spacing={4}>
              <Link href="/view">
                <Button w="full" variant="ghost">
                  View My Reports
                </Button>
              </Link>
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
