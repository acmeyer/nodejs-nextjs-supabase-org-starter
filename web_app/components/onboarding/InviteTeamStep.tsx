import { User } from "../../../server/src/models/user";
import { Organization } from "../../../server/src/models/organization";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import FormFieldError from "../forms/FormFieldError";
import FormFieldHelper from "../forms/FormFieldHelper";
import TextArea from "../forms/TextArea";
import { API_SERVER_URL } from "@/lib/constants";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";

const InviteTeamFormSchema = Yup.object().shape({
  teamEmails: Yup.string(),
});

type FormValues = {
  teamEmails: string;
};

export default function InviteTeamStep({
  user,
  organization,
}: {
  user: User;
  organization: Organization;
}) {
  const router = useRouter();
  const { session } = useAuth();

  const completeOnboarding = async (values: FormValues | null) => {
    await fetch(`${API_SERVER_URL}/onboarding/finish`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({
        teamEmails: values?.teamEmails,
        organizationId: organization.id,
      }),
    });
    router.push("/");
  }

  const onSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    try {
      await completeOnboarding(values);
      setSubmitting(false);
      resetForm();
    } catch (error) {
      alert(error);
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="mt-10">
        <h2 className="text-2xl font-bold leading-9 tracking-tight">
          Who else is on your team?
        </h2>
      </div>

      <div className="mt-10">
        <Formik
          initialValues={{
            teamEmails: "",
          }}
          validationSchema={InviteTeamFormSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <Field
                  as={TextArea}
                  type="text"
                  name="teamEmails"
                  id="teamEmails"
                  label="Add coworkers by email"
                  placeholder="ex. sarah@example.com, john@example.com"
                  required
                />
                <ErrorMessage name="name" render={(error) => <FormFieldError error={error} />} />
                <FormFieldHelper message="Enter the email addresses of the team members you'd like to invite, separated by commas." />
              </div>

              <div>
                <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
                  {isSubmitting ? "Please wait..." : "Invite Teammates"}
                </button>
              </div>

              <div className="flex justify-center">
                <p className="text-sm">
                  <button type="button" className="text-gray-400" onClick={() => completeOnboarding(null)}>
                    Skip this step
                  </button>
                </p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  )
}