import Users from '../app/users/page'
import Link from "next/link";
export default function HomePage() {
  return (
      <div>
        <h1>Welcome to the User Management App</h1>
          <Link href={'/add-user'}>
              Create user
          </Link>
          <Users/>
      </div>
  );
}
