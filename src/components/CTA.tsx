import HorizontalWrap from "./HorizontalWrap";
import { Button } from "./ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";


export default function CTA() {
  return (
    <section className="py-20 bg-linear-to-r from-blue-600 to-blue-700">
      <HorizontalWrap>
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-white mb-4">
            Ready to Stop Stressing About Parking?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students who have already found their perfect parking spot. 
            Sign up today and get your first week free!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg">
              Get Started Free
              <FontAwesomeIcon icon={faArrowRight} className="ml-2 size-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg bg-transparent text-white border-white hover:bg-white/10">
              Watch Demo
            </Button>
          </div>
          <p className="text-sm text-blue-100 mt-6">
            No credit card required • Cancel anytime • Student verified pricing
          </p>
        </div>
      </HorizontalWrap>
    </section>
  );
}
