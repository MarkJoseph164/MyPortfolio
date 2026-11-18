import {
  Document,
  Image,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { Site } from "@/lib/types";
import { experienceTypeLabel } from "@/lib/experience";

/* Greyscale only — this document is meant to be printed and photocopied. */
const INK = "#000000";
const BODY = "#2e2e2e";
const SUB = "#3c3c3c";
const MUTED = "#565656";
const RULE = "#d4d4d4";
const FRAME = "#cfcfcf";

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 34,
    paddingHorizontal: 44,
    fontFamily: "Helvetica",
    fontSize: 9.2,
    color: BODY,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerMain: {
    flex: 1,
    paddingRight: 16,
  },
  name: {
    fontFamily: "Times-Bold",
    fontSize: 23,
    lineHeight: 1.05,
    color: INK,
  },
  role: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.6,
    lineHeight: 1.3,
    color: SUB,
    letterSpacing: 0.2,
    marginTop: 3,
  },
  contact: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 7,
  },
  contactItem: {
    fontSize: 8.1,
    lineHeight: 1.5,
    color: MUTED,
    marginRight: 7,
  },
  photoFrame: {
    width: 70,
    height: 70,
    borderWidth: 0.8,
    borderColor: FRAME,
    borderStyle: "solid",
    alignItems: "center",
    justifyContent: "center",
  },
  photo: {
    width: 70,
    height: 70,
    objectFit: "cover",
  },
  photoPlaceholder: {
    fontSize: 6,
    letterSpacing: 1,
    color: "#8a8a8a",
    textAlign: "center",
  },
  rule: {
    height: 1,
    backgroundColor: RULE,
    marginTop: 13,
  },
  section: {
    marginTop: 10,
  },
  heading: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7.4,
    letterSpacing: 1.2,
    color: INK,
    textTransform: "uppercase",
    borderBottomWidth: 0.8,
    borderBottomColor: RULE,
    paddingBottom: 2.5,
    marginBottom: 5,
  },
  text: {
    fontSize: 8.7,
    lineHeight: 1.5,
    color: BODY,
  },
  skillRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  skillKey: {
    width: 112,
    fontFamily: "Helvetica-Bold",
    fontSize: 8.4,
    color: INK,
  },
  skillVal: {
    flex: 1,
    fontSize: 8.4,
    color: BODY,
  },
  item: {
    marginBottom: 8,
  },
  itemHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  itemTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: INK,
  },
  itemMeta: {
    fontSize: 7.8,
    color: MUTED,
  },
  itemSub: {
    fontSize: 8.3,
    color: SUB,
  },
  itemDesc: {
    fontSize: 8.3,
    lineHeight: 1.45,
    color: BODY,
    marginTop: 1.5,
  },
  tech: {
    fontSize: 7.6,
    color: MUTED,
    marginTop: 1.5,
  },
  bulletRow: {
    flexDirection: "row",
    marginTop: 1,
  },
  bulletDot: {
    width: 8,
    fontSize: 8,
    color: "#666666",
  },
  bulletText: {
    flex: 1,
    fontSize: 8.3,
    lineHeight: 1.42,
    color: BODY,
  },
  eduRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  eduDate: {
    width: 78,
    fontFamily: "Helvetica-Bold",
    fontSize: 7.8,
    color: MUTED,
  },
  eduBody: {
    flex: 1,
  },
  references: {
    fontSize: 7.4,
    color: MUTED,
    marginTop: 14,
  },
  footer: {
    position: "absolute",
    bottom: 16,
    left: 44,
    right: 44,
    fontSize: 6.6,
    color: "#8a8a8a",
    textAlign: "center",
  },
});

function ContactItem({ text, href }: { text: string; href?: string }) {
  return (
    <Text style={styles.contactItem}>
      {href ? (
        <Link src={href} style={{ color: MUTED, textDecoration: "none" }}>
          {text}
        </Link>
      ) : (
        text
      )}
    </Text>
  );
}

export default function CvDocument({
  site,
  portfolioUrl,
  photo,
}: {
  site: Site;
  portfolioUrl?: string;
  /** Data URL for the 1×1 photo, or null to render the placeholder frame. */
  photo?: string | null;
}) {
  const { profile, skills, experience, education, certifications, languages } =
    site;
  const projects = site.projects;
  const strengths = profile.strengths ?? [];

  const contacts: { text: string; href?: string }[] = [
    { text: profile.location },
    { text: profile.email, href: `mailto:${profile.email}` },
    ...(profile.showPhone ? [{ text: profile.phone }] : []),
    ...(profile.github
      ? [
          {
            text: profile.github.replace(/^https?:\/\/(www\.)?/, ""),
            href: profile.github,
          },
        ]
      : []),
    ...(portfolioUrl
      ? [
          {
            text: portfolioUrl
              .replace(/^https?:\/\/(www\.)?/, "")
              .replace(/\/$/, ""),
            href: portfolioUrl,
          },
        ]
      : []),
    ...(profile.linkedin
      ? [
          {
            text: profile.linkedin.replace(/^https?:\/\/(www\.)?/, ""),
            href: profile.linkedin,
          },
        ]
      : []),
    ...(profile.website
      ? [
          {
            text: profile.website.replace(/^https?:\/\/(www\.)?/, ""),
            href: profile.website,
          },
        ]
      : []),
  ].filter((item) => Boolean(item.text));

  return (
    <Document
      title={`${profile.name} — CV`}
      author={profile.name}
      subject={profile.title}
      creator="Portfolio"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerMain}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.role}>{profile.title}</Text>
            <View style={styles.contact}>
              {contacts.map((item, index) => (
                <ContactItem
                  key={`${item.text}-${index}`}
                  text={`${index > 0 ? "· " : ""}${item.text}`}
                  href={item.href}
                />
              ))}
            </View>
          </View>

          <View style={styles.photoFrame}>
            {photo ? (
              <Image src={photo} style={styles.photo} />
            ) : (
              <Text style={styles.photoPlaceholder}>1 × 1{"\n"}PHOTO</Text>
            )}
          </View>
        </View>

        <View style={styles.rule} />

        <View style={styles.section}>
          <Text style={styles.heading}>Profile</Text>
          <Text style={styles.text}>{profile.summary}</Text>
        </View>

        {education.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.heading}>Education</Text>
            {education.map((entry, index) => (
              <View
                key={`${entry.school}-${index}`}
                style={styles.eduRow}
                wrap={false}
              >
                <Text style={styles.eduDate}>
                  {[entry.start, entry.end].filter(Boolean).join(" – ")}
                </Text>
                <View style={styles.eduBody}>
                  <Text style={styles.itemTitle}>{entry.program}</Text>
                  <Text style={styles.itemDesc}>{entry.school}</Text>
                  {entry.note ? (
                    <Text style={styles.tech}>{entry.note}</Text>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        ) : null}

        {experience.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.heading}>Experience &amp; Activities</Text>
            {experience.map((job, index) => (
              <View
                key={`${job.company}-${index}`}
                style={styles.item}
                wrap={false}
              >
                <View style={styles.itemHead}>
                  <Text style={styles.itemTitle}>{job.role}</Text>
                  <Text style={styles.itemMeta}>
                    {[job.start, job.end].filter(Boolean).join(" – ")}
                  </Text>
                </View>
                <Text style={styles.itemSub}>
                  {[experienceTypeLabel(job.type), job.company, job.location]
                    .filter(Boolean)
                    .join(" · ")}
                </Text>
                {job.bullets.map((bullet, bulletIndex) => (
                  <View key={bulletIndex} style={styles.bulletRow}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{bullet}</Text>
                  </View>
                ))}
                {job.tech.length > 0 ? (
                  <Text style={styles.tech}>
                    Topics: {job.tech.join(", ")}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {projects.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.heading}>Projects</Text>
            {projects.map((project) => (
              <View key={project.slug} style={styles.item} wrap={false}>
                <View style={styles.itemHead}>
                  <Text style={styles.itemTitle}>
                    {project.name}
                    {project.subtitle ? ` — ${project.subtitle}` : ""}
                  </Text>
                  <Text style={styles.itemMeta}>
                    {[project.role, project.year].filter(Boolean).join(" · ")}
                  </Text>
                </View>
                <Text style={styles.itemDesc}>{project.summary}</Text>
                {project.tech.length > 0 ? (
                  <Text style={styles.tech}>
                    Technologies: {project.tech.join(", ")}
                  </Text>
                ) : null}
                {project.url ? (
                  <Text style={styles.tech}>
                    <Link
                      src={project.url}
                      style={{ color: MUTED, textDecoration: "none" }}
                    >
                      {project.url.replace(/^https?:\/\//, "")}
                    </Link>
                  </Text>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {skills.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.heading}>Technical Skills</Text>
            {skills.map((group) => (
              <View key={group.group} style={styles.skillRow} wrap={false}>
                <Text style={styles.skillKey}>{group.group}</Text>
                <Text style={styles.skillVal}>{group.items.join(", ")}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {certifications.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.heading}>Certifications &amp; Awards</Text>
            {certifications.map((cert, index) => (
              <View
                key={`${cert.name}-${index}`}
                style={styles.skillRow}
                wrap={false}
              >
                <Text style={styles.skillKey}>{cert.year}</Text>
                <Text style={styles.skillVal}>
                  {cert.name}
                  {cert.issuer ? ` — ${cert.issuer}` : ""}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {(languages.length > 0 || strengths.length > 0) && (
          <View style={styles.section}>
            {languages.length > 0 ? (
              <View style={styles.skillRow}>
                <Text style={styles.skillKey}>Languages</Text>
                <Text style={styles.skillVal}>{languages.join(", ")}</Text>
              </View>
            ) : null}
            {strengths.length > 0 ? (
              <View style={styles.skillRow}>
                <Text style={styles.skillKey}>Strengths</Text>
                <Text style={styles.skillVal}>{strengths.join(" · ")}</Text>
              </View>
            ) : null}
          </View>
        )}

        <Text style={styles.references}>References available upon request.</Text>

        <Text style={styles.footer} fixed>
          {profile.name} · {profile.email}
        </Text>
      </Page>
    </Document>
  );
}
