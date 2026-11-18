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

/* Greyscale document design. The photo keeps its original colour. */
const INK = "#000000";
const BODY = "#2e2e2e";
const SUB = "#3c3c3c";
const MUTED = "#565656";
const RULE = "#d4d4d4";
const FRAME = "#cfcfcf";

/**
 * `scale` shrinks typography and spacing so the CV fits one A4 page.
 * 1 = designed size; the route lowers it until the document is a single page.
 */
function makeStyles(k: number) {
  const n = (value: number) => Math.round(value * k * 10) / 10;

  return StyleSheet.create({
    page: {
      paddingTop: n(34),
      paddingBottom: n(42),
      paddingHorizontal: n(40),
      fontFamily: "Helvetica",
      fontSize: n(9.2),
      color: BODY,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    headerMain: {
      flex: 1,
      paddingRight: n(14),
    },
    name: {
      fontFamily: "Times-Bold",
      fontSize: n(22),
      lineHeight: 1.05,
      color: INK,
    },
    role: {
      fontFamily: "Helvetica-Bold",
      fontSize: n(9.4),
      lineHeight: 1.3,
      color: SUB,
      letterSpacing: 0.2,
      marginTop: n(3),
    },
    contact: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: n(6),
    },
    contactItem: {
      fontSize: n(8),
      lineHeight: 1.5,
      color: MUTED,
      marginRight: n(7),
    },
    photoFrame: {
      width: n(68),
      height: n(68),
      borderWidth: 0.8,
      borderColor: FRAME,
      borderStyle: "solid",
      alignItems: "center",
      justifyContent: "center",
    },
    photo: {
      width: n(68),
      height: n(68),
      objectFit: "cover",
    },
    photoPlaceholder: {
      fontSize: n(6),
      letterSpacing: 1,
      color: "#8a8a8a",
      textAlign: "center",
    },
    rule: {
      height: 1,
      backgroundColor: RULE,
      marginTop: n(12),
    },
    section: {
      marginTop: n(9),
    },
    heading: {
      fontFamily: "Helvetica-Bold",
      fontSize: n(7.3),
      letterSpacing: 1.2,
      color: INK,
      textTransform: "uppercase",
      borderBottomWidth: 0.8,
      borderBottomColor: RULE,
      paddingBottom: n(2.4),
      marginBottom: n(4.5),
    },
    text: {
      fontSize: n(8.6),
      lineHeight: 1.45,
      color: BODY,
    },
    skillRow: {
      flexDirection: "row",
      marginBottom: n(2),
    },
    skillKey: {
      width: n(110),
      fontFamily: "Helvetica-Bold",
      fontSize: n(8.3),
      color: INK,
    },
    skillVal: {
      flex: 1,
      fontSize: n(8.3),
      color: BODY,
    },
    item: {
      marginBottom: n(7),
    },
    itemHead: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
    },
    itemTitle: {
      fontFamily: "Helvetica-Bold",
      fontSize: n(8.9),
      color: INK,
    },
    itemMeta: {
      fontSize: n(7.7),
      color: MUTED,
    },
    itemSub: {
      fontSize: n(8.2),
      color: SUB,
    },
    itemDesc: {
      fontSize: n(8.2),
      lineHeight: 1.4,
      color: BODY,
      marginTop: n(1.5),
    },
    tech: {
      fontSize: n(7.5),
      color: MUTED,
      marginTop: n(1.5),
    },
    bulletRow: {
      flexDirection: "row",
      marginTop: n(1),
    },
    bulletDot: {
      width: n(8),
      fontSize: n(8),
      color: "#666666",
    },
    bulletText: {
      flex: 1,
      fontSize: n(8.2),
      lineHeight: 1.38,
      color: BODY,
    },
    eduRow: {
      flexDirection: "row",
      marginBottom: n(5),
    },
    eduDate: {
      width: n(76),
      fontFamily: "Helvetica-Bold",
      fontSize: n(7.7),
      color: MUTED,
    },
    eduBody: {
      flex: 1,
    },
    references: {
      fontSize: n(7.3),
      color: MUTED,
      marginTop: n(11),
    },
    footerBar: {
      position: "absolute",
      bottom: n(15),
      left: n(40),
      right: n(40),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    footerText: {
      fontSize: n(6.6),
      color: "#8a8a8a",
    },
  });
}

function ContactItem({
  text,
  href,
  style,
}: {
  text: string;
  href?: string;
  style: ReturnType<typeof makeStyles>["contactItem"];
}) {
  return (
    <Text style={style}>
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
  scale = 1,
}: {
  site: Site;
  portfolioUrl?: string;
  /** Data URL for the 1×1 photo, or null to render the placeholder frame. */
  photo?: string | null;
  /** Typography scale used to keep the document on one A4 page. */
  scale?: number;
}) {
  const styles = makeStyles(scale);
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
                  style={styles.contactItem}
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
          <Text style={styles.heading} minPresenceAhead={26}>
            Profile
          </Text>
          <Text style={styles.text}>{profile.summary}</Text>
        </View>

        {education.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.heading} minPresenceAhead={26}>
              Education
            </Text>
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
            <Text style={styles.heading} minPresenceAhead={26}>
              Experience &amp; Activities
            </Text>
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
            <Text style={styles.heading} minPresenceAhead={26}>
              Projects
            </Text>
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
            <Text style={styles.heading} minPresenceAhead={26}>
              Technical Skills
            </Text>
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
            <Text style={styles.heading} minPresenceAhead={26}>
              Certifications &amp; Awards
            </Text>
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

        <View style={styles.footerBar} fixed>
          <Text style={styles.footerText}>
            {profile.name} · {profile.email}
          </Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) =>
              totalPages > 1 ? `${pageNumber} / ${totalPages}` : ""
            }
          />
        </View>
      </Page>
    </Document>
  );
}
