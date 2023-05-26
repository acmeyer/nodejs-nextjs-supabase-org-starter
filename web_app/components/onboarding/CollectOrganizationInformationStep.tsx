import { User } from "../../../server/src/models/user";
import { Organization } from "../../../server/src/models/organization";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import TextInput from "../forms/TextInput";
import FormFieldError from "../forms/FormFieldError";
import CheckBoxInput from "../forms/CheckBoxInput";
import { useAuth } from "@/contexts/authContext";
import { API_SERVER_URL } from "@/lib/constants";

const OrganizationDetailsFormSchema = Yup.object().shape({
  fullName: Yup.string().required("Your name is required."),
  organizationName: Yup.string().required("An organization name is required."),
  allowEmailDomainSignUp: Yup.boolean(),
});

type FormValues = {
  fullName: string;
  organizationName: string;
  allowEmailDomainSignUp: boolean;
};

export default function CollectOrganizationInformationStep({
  user,
  organization,
  onComplete,
}: {
  user: User;
  organization: Organization;
  onComplete: () => void;
}) {
  const { session } = useAuth();

  const onSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    try {
      await fetch(`${API_SERVER_URL}/onboarding/updateOrganization`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          user: {
            id: user.id,
            name: values.fullName,
          },
          organization: {
            id: organization.id,
            name: values.organizationName,
            allows_email_domain_signup: values.allowEmailDomainSignUp,
          }
        }),
      });
      onComplete();
      setSubmitting(false);
    } catch (error) {
      alert(error);
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="mt-10">
        <h2 className="text-2xl font-bold leading-9 tracking-tight">
          First, tell us a bit about yourself.
        </h2>
      </div>

      <div className="mt-10">
        <Formik
          initialValues={{
            fullName: user.name || "",
            organizationName: organization.name || "",
            allowEmailDomainSignUp: true,
          }}
          validationSchema={OrganizationDetailsFormSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <Field
                  as={TextInput}
                  type="text"
                  name="fullName"
                  id="fullName"
                  label="What's your full name?"
                  placeholder="Sarah Connor"
                  required
                />
                <ErrorMessage name="name" render={(error) => <FormFieldError error={error} />} />
              </div>

              <div>
                <Field
                  as={TextInput}
                  type="text"
                  name="organizationName"
                  id="organizationName"
                  label="What's the name of your organization?"
                  placeholder="SkyNet"
                  required
                />
                <ErrorMessage name="name" render={(error) => <FormFieldError error={error} />} />
              </div>

              {organization.domain && (
                <div className="relative items-start">
                  <CheckBoxInput name="allowEmailDomainSignUp" disabled label={`Allow anyone with an @${organization.domain} email address to join this organization.`} />
                  <ErrorMessage
                    name="allowEmailDomainSignUp"
                    render={(error) => <FormFieldError error={error} />}
                  />
                </div>
              )}

              <div>
                <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
                  {isSubmitting ? "Please wait..." : "Continue"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  )
}