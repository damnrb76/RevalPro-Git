import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NmcResources() {
  // NMC important links
  const nmcLinks = {
    login: "https://www.nmc.org.uk/registration/nmc-online/",
    revalidation: "https://www.nmc.org.uk/revalidation/",
    searchRegister: "https://www.nmc.org.uk/registration/search-the-register/",
    theCode: "https://www.nmc.org.uk/standards/code/",
    standards: "https://www.nmc.org.uk/standards/",
    contact: "https://www.nmc.org.uk/contact-us/",
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6 text-revalpro-dark-blue">NMC Resources</h1>
      <p className="text-muted-foreground mb-8">
        Quick access to important NMC services and resources for nurses and midwives
      </p>
      
      <Card>
        <CardHeader>
          <CardTitle>NMC Online Resources</CardTitle>
          <CardDescription>
            Quick links to important NMC services and resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Button asChild variant="outline" className="h-auto py-4 justify-start">
              <a
                href={nmcLinks.login}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-start"
              >
                <span className="font-semibold">NMC Online</span>
                <span className="text-sm text-muted-foreground mt-1">
                  Log in to your NMC Online account
                </span>
              </a>
            </Button>

            <Button asChild variant="outline" className="h-auto py-4 justify-start">
              <a
                href={nmcLinks.revalidation}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-start"
              >
                <span className="font-semibold">Revalidation</span>
                <span className="text-sm text-muted-foreground mt-1">
                  Official revalidation guidance from the NMC
                </span>
              </a>
            </Button>

            <Button asChild variant="outline" className="h-auto py-4 justify-start">
              <a
                href={nmcLinks.searchRegister}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-start"
              >
                <span className="font-semibold">Search Register</span>
                <span className="text-sm text-muted-foreground mt-1">
                  Check registration status of any nurse or midwife
                </span>
              </a>
            </Button>

            <Button asChild variant="outline" className="h-auto py-4 justify-start">
              <a
                href={nmcLinks.theCode}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-start"
              >
                <span className="font-semibold">The Code</span>
                <span className="text-sm text-muted-foreground mt-1">
                  Professional standards for nurses and midwives
                </span>
              </a>
            </Button>

            <Button asChild variant="outline" className="h-auto py-4 justify-start">
              <a
                href={nmcLinks.standards}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-start"
              >
                <span className="font-semibold">Standards</span>
                <span className="text-sm text-muted-foreground mt-1">
                  NMC professional standards and guidance
                </span>
              </a>
            </Button>

            <Button asChild variant="outline" className="h-auto py-4 justify-start">
              <a
                href={nmcLinks.contact}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-start"
              >
                <span className="font-semibold">Contact NMC</span>
                <span className="text-sm text-muted-foreground mt-1">
                  Get support from the NMC directly
                </span>
              </a>
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Note: Links open the official NMC website in a new tab
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}