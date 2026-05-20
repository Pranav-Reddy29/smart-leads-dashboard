import { Link } from "react-router-dom";

import Button from "../components/common/Button";
import Card from "../components/common/Card";

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-(--app-background) px-4">
      <Card className="max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">
          404
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-(--foreground)">
          This page drifted out of the pipeline.
        </h1>
        <p className="mt-4 text-sm leading-6 text-(--muted-foreground)">
          The page you requested does not exist, or the route has changed during the workspace rebuild.
        </p>
        <div className="mt-8 flex justify-center">
          <Link to="/dashboard">
            <Button>Back to dashboard</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default NotFoundPage;
