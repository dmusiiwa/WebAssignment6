import { getToken } from "./authenticate";

async function fetchWithToken(url, method = "GET") {
  const res = await fetch(url, {
    method,
    headers: { Authorization: `JWT ${getToken()}` }
  });
  if (res.status === 200) {
    return res.json();
  } else {
    return [];
  }
}

export async function addToFavourites(id) {
  return fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/favourites/${id}`, "PUT");
}

export async function removeFromFavourites(id) {
  return fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/favourites/${id}`, "DELETE");
}

export async function getFavourites() {
  return fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/favourites`);
}

export async function addToHistory(id) {
  return fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/history/${id}`, "PUT");
}

export async function removeFromHistory(id) {
  return fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/history/${id}`, "DELETE");
}

export async function getHistory() {
  return fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/history`);
}
